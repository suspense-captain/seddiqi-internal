import { generateUniqueId } from "@utils/helpers/uniqueId";

const CardSection = ({
  title,
  Component,
  cards,
  containerStyle,
  cardStyle,
  titleStyle,
}) => {
  return (
    cards && (
      <div className={containerStyle}>
        <div className={titleStyle}>{title}</div>
        <div className={cardStyle}>
          {Array.isArray(cards) && cards.length > 0 ? (
            cards.map((item, index) => (
              <Component key={generateUniqueId()} item={item} />
            ))
          ) : (
            <Component key={generateUniqueId()} item={cards} />
          )}
        </div>
      </div>
    )
  );
};

export default CardSection;
